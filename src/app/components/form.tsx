import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/card";
import { Button } from "@/app/components/button";

// Generic form wrapper component
export interface FormWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText?: string;
}

export const Form: React.FC<FormWrapperProps> = ({
  title,
  description,
  children,
  onSubmit,
  submitButtonText,
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">{children}</div>
          <Button type="submit" className="w-full">
            {submitButtonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
