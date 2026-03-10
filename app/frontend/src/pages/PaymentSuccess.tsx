import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { verifyPayment, saveUserPrefs } from '@/lib/api-helpers';

type VerifyState = 'loading' | 'success' | 'failed';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<VerifyState>('loading');
  const [planName, setPlanName] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setState('failed');
      return;
    }

    const verify = async () => {
      const result = await verifyPayment(sessionId);
      if (result && result.status === 'paid') {
        setState('success');
        const planId = result.plan_id || 'soldier';
        setPlanName(planId === 'officer' ? 'Officer' : 'Soldier');

        // Update user preferences with new subscription tier
        await saveUserPrefs({
          subscription_tier: planId,
          subscription_status: 'active',
        });
      } else {
        setState('failed');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <Layout>
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[70vh]">
        <Card className="bg-[#1E2A3A] border-[#2D3B4E] max-w-md w-full">
          <CardContent className="p-8 text-center space-y-6">
            {state === 'loading' && (
              <>
                <Loader2 className="w-16 h-16 text-green-400 mx-auto animate-spin" />
                <h2 className="text-xl font-bold text-white">Verifying Payment...</h2>
                <p className="text-slate-400 text-sm">
                  Please wait while we confirm your payment with Stripe.
                </p>
              </>
            )}

            {state === 'success' && (
              <>
                <div className="w-20 h-20 rounded-full bg-green-500/20 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
                <h2 className="text-2xl font-extrabold text-white">Payment Successful!</h2>
                <Badge className="bg-green-500/10 text-green-400 border-0 text-sm px-4 py-1">
                  {planName} Plan Activated
                </Badge>
                <p className="text-slate-400 text-sm">
                  Welcome to the {planName} plan! You now have access to all {planName.toLowerCase()}-tier features.
                  Your subscription is active and ready to use.
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            )}

            {state === 'failed' && (
              <>
                <div className="w-20 h-20 rounded-full bg-red-500/20 mx-auto flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-red-400" />
                </div>
                <h2 className="text-2xl font-extrabold text-white">Payment Issue</h2>
                <p className="text-slate-400 text-sm">
                  We couldn't verify your payment. If you were charged, please contact support
                  and we'll resolve this for you.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => navigate('/pricing')}
                    variant="outline"
                    className="flex-1 border-[#2D3B4E] text-slate-300 hover:bg-[#2D3B4E]"
                  >
                    Back to Plans
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Dashboard
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}