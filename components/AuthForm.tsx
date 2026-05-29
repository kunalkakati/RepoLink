"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
import useAuthStore from "@/store/AuthStore";

const AuthForm = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { LogIn } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  const CheckPass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    LogIn(password);
    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto overflow-hidden shadow-2xl border bg-card/95 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center pb-4 pt-6 px-4 sm:px-6">
          <div className="mx-auto w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-card-foreground">
              Access Required
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter the password to access your link vault
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-4 pb-6 sm:px-6">
          <form onSubmit={CheckPass} className="space-y-5">
            <div className="space-y-3">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="pr-12 h-12 text-base border-border bg-background text-foreground focus:border-primary focus:ring-primary/20"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {error && (
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isLoading || !password.trim()}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                "Access Vault"
              )}
            </Button>
          </form>

          <div className="rounded-2xl bg-muted px-4 py-3 text-center text-xs text-muted-foreground border border-border">
            Secure access to your personal link collection
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
