import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.progress_entries import Progress_entriesService
from dependencies.auth import get_current_user
from schemas.auth import UserResponse

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/progress_entries", tags=["progress_entries"])


# ---------- Pydantic Schemas ----------
class Progress_entriesData(BaseModel):
    """Entity data schema (for create/update)"""
    branch: str
    date: datetime
    exercises: str


class Progress_entriesUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    branch: Optional[str] = None
    date: Optional[datetime] = None
    exercises: Optional[str] = None


class Progress_entriesResponse(BaseModel):
    """Entity response schema"""
    id: int
    user_id: str
    branch: str
    date: datetime
    exercises: str

    class Config:
        from_attributes = True


class Progress_entriesListResponse(BaseModel):
    """List response schema"""
    items: List[Progress_entriesResponse]
    total: int
    skip: int
    limit: int


class Progress_entriesBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[Progress_entriesData]


class Progress_entriesBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: Progress_entriesUpdateData


class Progress_entriesBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[Progress_entriesBatchUpdateItem]


class Progress_entriesBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=Progress_entriesListResponse)
async def query_progress_entriess(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Query progress_entriess with filtering, sorting, and pagination (user can only see their own records)"""
    logger.debug(f"Querying progress_entriess: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = Progress_entriesService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")
        
        result = await service.get_list(
            skip=skip, 
            limit=limit,
            query_dict=query_dict,
            sort=sort,
            user_id=str(current_user.id),
        )
        logger.debug(f"Found {result['total']} progress_entriess")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying progress_entriess: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=Progress_entriesListResponse)
async def query_progress_entriess_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query progress_entriess with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying progress_entriess: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = Progress_entriesService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")

        result = await service.get_list(
            skip=skip,
            limit=limit,
            query_dict=query_dict,
            sort=sort
        )
        logger.debug(f"Found {result['total']} progress_entriess")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying progress_entriess: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=Progress_entriesResponse)
async def get_progress_entries(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single progress_entries by ID (user can only see their own records)"""
    logger.debug(f"Fetching progress_entries with id: {id}, fields={fields}")
    
    service = Progress_entriesService(db)
    try:
        result = await service.get_by_id(id, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Progress_entries with id {id} not found")
            raise HTTPException(status_code=404, detail="Progress_entries not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching progress_entries {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=Progress_entriesResponse, status_code=201)
async def create_progress_entries(
    data: Progress_entriesData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new progress_entries"""
    logger.debug(f"Creating new progress_entries with data: {data}")
    
    service = Progress_entriesService(db)
    try:
        result = await service.create(data.model_dump(), user_id=str(current_user.id))
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create progress_entries")
        
        logger.info(f"Progress_entries created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating progress_entries: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating progress_entries: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[Progress_entriesResponse], status_code=201)
async def create_progress_entriess_batch(
    request: Progress_entriesBatchCreateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create multiple progress_entriess in a single request"""
    logger.debug(f"Batch creating {len(request.items)} progress_entriess")
    
    service = Progress_entriesService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump(), user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} progress_entriess successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[Progress_entriesResponse])
async def update_progress_entriess_batch(
    request: Progress_entriesBatchUpdateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update multiple progress_entriess in a single request (requires ownership)"""
    logger.debug(f"Batch updating {len(request.items)} progress_entriess")
    
    service = Progress_entriesService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict, user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} progress_entriess successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=Progress_entriesResponse)
async def update_progress_entries(
    id: int,
    data: Progress_entriesUpdateData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing progress_entries (requires ownership)"""
    logger.debug(f"Updating progress_entries {id} with data: {data}")

    service = Progress_entriesService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Progress_entries with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Progress_entries not found")
        
        logger.info(f"Progress_entries {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating progress_entries {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating progress_entries {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_progress_entriess_batch(
    request: Progress_entriesBatchDeleteRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple progress_entriess by their IDs (requires ownership)"""
    logger.debug(f"Batch deleting {len(request.ids)} progress_entriess")
    
    service = Progress_entriesService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id, user_id=str(current_user.id))
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} progress_entriess successfully")
        return {"message": f"Successfully deleted {deleted_count} progress_entriess", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_progress_entries(
    id: int,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a single progress_entries by ID (requires ownership)"""
    logger.debug(f"Deleting progress_entries with id: {id}")
    
    service = Progress_entriesService(db)
    try:
        success = await service.delete(id, user_id=str(current_user.id))
        if not success:
            logger.warning(f"Progress_entries with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Progress_entries not found")
        
        logger.info(f"Progress_entries {id} deleted successfully")
        return {"message": "Progress_entries deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting progress_entries {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")