
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const handleRedirectToAuth = () => {
    // TODO: Redirect to main company authentication system
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-nums-green-50 via-white to-nums-green-100">
      <div className="w-full max-w-md space-y-6">
        {/* Logo Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-3 rounded-full nums-gradient shadow-lg animate-pulse-glow">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">NUMS</h1>
            <p className="text-sm text-nums-green-700">Nutribev Utility Management System</p>
          </div>
        </div>

        {/* Access Card */}
        <Card className="glass-card-solid">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-900">Admin Access Required</CardTitle>
            <CardDescription>Please authenticate through the company login system</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Access to the NUMS Admin Panel requires proper authentication and admin privileges.
            </p>
            
            <Button 
              onClick={handleRedirectToAuth}
              className="w-full nums-gradient hover:from-nums-green-600 hover:to-nums-green-700"
            >
              Go to Company Login
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          © 2025 ABN Utilities • NutribeV Utility Management System (NUMS)
        </div>
      </div>
    </div>
  );
};
