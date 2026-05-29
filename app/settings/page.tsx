"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to determine if a hex color is light or dark
function getContrastForeground(hexcolor: string) {
  // If a leading # is provided, remove it
  if (hexcolor.slice(0, 1) === "#") {
    hexcolor = hexcolor.slice(1);
  }
  // Convert to RGB value
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  // Get YIQ ratio
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  // Check contrast
  return yiq >= 128 ? "#121212" : "#E0E0E0";
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [accentColor, setAccentColor] = useState<string>("#121212");

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("accent-color");
    if (stored) {
      setAccentColor(stored);
      document.documentElement.style.setProperty("--primary-foreground", getContrastForeground(stored));
    }
  }, []);

  const handleAccentColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setAccentColor(newColor);
    localStorage.setItem("accent-color", newColor);
    document.documentElement.style.setProperty("--primary", newColor);
    document.documentElement.style.setProperty("--primary-foreground", getContrastForeground(newColor));
  };

  const resetAccentColor = () => {
    localStorage.removeItem("accent-color");
    // Reset to default depending on theme
    const defaultColor = theme === "dark" ? "#E0E0E0" : "#121212";
    setAccentColor(defaultColor);
    document.documentElement.style.removeProperty("--primary");
    document.documentElement.style.removeProperty("--primary-foreground");
  };

  if (!mounted) return null;

  return (
    <div className="container max-w-4xl py-10 mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appearance</h1>
        <p className="text-muted-foreground">
          Customize the appearance of the app. Automatically switch between day and night themes.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg">Theme Preference</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Light Theme Card */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setTheme("light")}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border-2 p-4 hover:border-primary hover:bg-accent transition-all bg-white",
                  theme === "light" ? "border-primary" : "border-muted"
                )}
              >
                <div className="flex items-center gap-2 mb-4 text-[#121212]">
                  <Sun className="w-6 h-6" />
                  <span className="font-semibold">Light</span>
                </div>
                {/* Mini Preview */}
                <div className="w-full h-24 rounded-md border border-[#C7C7C7] bg-[#E0E0E0] p-2 flex flex-col gap-2 shadow-sm">
                  <div className="h-4 w-1/2 bg-[#D4D4D4] rounded-sm"></div>
                  <div className="h-4 w-full bg-white rounded-sm border border-[#C7C7C7]"></div>
                  <div className="mt-auto h-6 w-full bg-[#121212] text-[#E0E0E0] rounded-sm flex items-center justify-center text-[10px] font-bold">
                    Button
                  </div>
                </div>
              </button>
            </div>

            {/* Dark Theme Card */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border-2 p-4 hover:border-primary hover:bg-accent transition-all bg-[#121212]",
                  theme === "dark" ? "border-primary" : "border-muted"
                )}
              >
                <div className="flex items-center gap-2 mb-4 text-[#E0E0E0]">
                  <Moon className="w-6 h-6" />
                  <span className="font-semibold">Dark</span>
                </div>
                {/* Mini Preview */}
                <div className="w-full h-24 rounded-md border border-[rgba(224,224,224,0.1)] bg-[#121212] p-2 flex flex-col gap-2 shadow-sm">
                  <div className="h-4 w-1/2 bg-[#2A2A2A] rounded-sm"></div>
                  <div className="h-4 w-full bg-[#1A1A1A] rounded-sm border border-[rgba(224,224,224,0.1)]"></div>
                  <div className="mt-auto h-6 w-full bg-[#E0E0E0] text-[#121212] rounded-sm flex items-center justify-center text-[10px] font-bold">
                    Button
                  </div>
                </div>
              </button>
            </div>

            {/* System Theme Card */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setTheme("system")}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border-2 p-4 hover:border-primary hover:bg-accent transition-all bg-background",
                  theme === "system" ? "border-primary" : "border-muted"
                )}
              >
                <div className="flex items-center gap-2 mb-4 text-foreground">
                  <Monitor className="w-6 h-6" />
                  <span className="font-semibold">System</span>
                </div>
                {/* Mini Preview (Split) */}
                <div className="w-full h-24 rounded-md flex overflow-hidden border border-border shadow-sm">
                  {/* Left Half (Light) */}
                  <div className="w-1/2 h-full bg-[#E0E0E0] p-1.5 flex flex-col gap-1 border-r border-[#C7C7C7]">
                    <div className="h-3 w-3/4 bg-[#D4D4D4] rounded-sm"></div>
                    <div className="h-3 w-full bg-white rounded-sm border border-[#C7C7C7]"></div>
                    <div className="mt-auto h-4 w-full bg-[#121212] rounded-sm"></div>
                  </div>
                  {/* Right Half (Dark) */}
                  <div className="w-1/2 h-full bg-[#121212] p-1.5 flex flex-col gap-1">
                    <div className="h-3 w-3/4 bg-[#2A2A2A] rounded-sm"></div>
                    <div className="h-3 w-full bg-[#1A1A1A] rounded-sm border border-[rgba(224,224,224,0.1)]"></div>
                    <div className="mt-auto h-4 w-full bg-[#E0E0E0] rounded-sm"></div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Accent Color</CardTitle>
            <CardDescription>
              Choose a custom accent color for primary buttons and active states.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="color-picker">Select Color</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="color-picker"
                    type="color"
                    value={accentColor}
                    onChange={handleAccentColorChange}
                    className="w-16 h-12 p-1 cursor-pointer"
                  />
                  <Input 
                    type="text" 
                    value={accentColor} 
                    onChange={handleAccentColorChange}
                    className="w-32 uppercase font-mono"
                    placeholder="#121212"
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2 justify-end h-full mt-6">
                 <Button variant="outline" onClick={resetAccentColor}>
                    Reset to Default
                 </Button>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Live Component Preview</h4>
              <div className="flex flex-wrap gap-4 items-center p-4 bg-card rounded-lg border">
                 <Button>Primary Button</Button>
                 <Button variant="secondary">Secondary</Button>
                 <Button variant="outline">Outline</Button>
                 <div className="flex items-center gap-2 ml-4">
                    <div className="w-4 h-4 rounded-full bg-primary ring-2 ring-primary/20"></div>
                    <span className="text-sm text-foreground font-medium">Active State</span>
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
