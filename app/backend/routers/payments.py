import logging
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
import stripe

from core.database import get_db
from core.config import settings
from dependencies.auth import get_current_user
from schemas.auth import UserResponse
from services.orders import OrdersService

stripe.api_key = settings.stripe_secret_key

router = APIRouter(prefix="/api/v1/payment", tags=["payment"])

logger = logging.getLogger(__name__)

# Plan configuration with Stripe price IDs
PLANS = {
    "soldier": {
        "name": "Soldier",
        "price_amount": 499,  # £4.99 in pence
        "currency": "gbp",
        "stripe_price_id": "price_1T8nAn2SvEKrWA1PUuLY7wG7",
        "description": "Soldier Plan - Cloud sync, full training plans and more",
    },
    "officer": {
        "name": "Officer",
        "price_amount": 999,  # £9.99 in pence
        "currency": "gbp",
        "stripe_price_id": "price_1T8nB32SvEKrWA1P7jtHPYyK",
        "description": "Officer Plan - Everything included plus personalised coaching",
    },
}


class CheckoutSessionRequest(BaseModel):
    plan_id: str


class CheckoutSessionResponse(BaseModel):
    session_id: str
    url: str


class PaymentVerificationRequest(BaseModel):
    session_id: str


class PaymentStatusResponse(BaseModel):
    status: str
    order_id: int = None
    payment_status: str
    plan_id: str = None


@router.post("/create_payment_session", response_model=CheckoutSessionResponse)
async def create_payment_session(
    data: CheckoutSessionRequest,
    request: Request,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a Stripe checkout session for a subscription plan"""
    try:
        plan = PLANS.get(data.plan_id)
        if not plan:
            raise HTTPException(status_code=400, detail=f"Invalid plan: {data.plan_id}")

        # Get frontend host
        frontend_host = request.headers.get("App-Host")
        if frontend_host and not frontend_host.startswith(("http://", "https://")):
            frontend_host = f"https://{frontend_host}"

        # Create order in database
        service = OrdersService(db)
        order = await service.create(
            {
                "plan_id": data.plan_id,
                "plan_name": plan["name"],
                "amount": plan["price_amount"],
                "currency": plan["currency"],
                "status": "pending",
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            },
            user_id=str(current_user.id),
        )

        if not order:
            raise HTTPException(status_code=500, detail="Failed to create order")

        # Use the Stripe price ID directly
        line_items = [{"price": plan["stripe_price_id"], "quantity": 1}]

        # Create Stripe checkout session
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=f"{frontend_host}/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{frontend_host}/pricing",
            metadata={
                "order_id": str(order.id),
                "user_id": str(current_user.id),
                "plan_id": data.plan_id,
            },
        )

        # Update order with stripe session id
        await service.update(
            order.id,
            {
                "stripe_session_id": session.id,
                "updated_at": datetime.now(),
            },
            user_id=str(current_user.id),
        )

        return CheckoutSessionResponse(session_id=session.id, url=session.url)

    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        raise HTTPException(status_code=500, detail=f"Payment service error: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Payment session creation error: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create payment session: {str(e)}"
        )


@router.post("/verify_payment", response_model=PaymentStatusResponse)
async def verify_payment(
    data: PaymentVerificationRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Verify payment status and update order"""
    try:
        session = stripe.checkout.Session.retrieve(data.session_id)
        order_id = session.metadata.get("order_id")
        plan_id = session.metadata.get("plan_id")

        # Map Stripe status to our status
        status_mapping = {
            "complete": "paid",
            "open": "pending",
            "expired": "cancelled",
        }
        status = status_mapping.get(session.status, "pending")

        # Update order status
        if order_id:
            service = OrdersService(db)
            await service.update(
                int(order_id),
                {
                    "status": status,
                    "updated_at": datetime.now(),
                },
                user_id=str(current_user.id),
            )

        return PaymentStatusResponse(
            status=status,
            order_id=int(order_id) if order_id else None,
            payment_status=session.payment_status or "unpaid",
            plan_id=plan_id,
        )

    except stripe.error.StripeError as e:
        logger.error(f"Stripe verification error: {e}")
        raise HTTPException(status_code=500, detail=f"Payment verification error: {str(e)}")
    except Exception as e:
        logger.error(f"Payment verification error: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to verify payment: {str(e)}"
        )