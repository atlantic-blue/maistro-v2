"use client";

import * as React from "react";
import {
  Button,
  Input,
  Label,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Spinner,
} from "@maistro/ui";
import type { CreateProjectInput } from "@maistro/types";

interface IdeaFormProps {
  onSubmit: (data: CreateProjectInput) => Promise<void>;
  isLoading?: boolean;
}

type Step = 1 | 2 | 3;

export function IdeaForm({ onSubmit, isLoading = false }: IdeaFormProps) {
  const [step, setStep] = React.useState<Step>(1);
  const [formData, setFormData] = React.useState<Partial<CreateProjectInput>>({
    name: "",
    description: "",
    targetAudience: "",
    problem: "",
    solution: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const updateField = (field: keyof CreateProjectInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (currentStep: Step): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name?.trim()) {
        newErrors.name = "Project name is required";
      }
      if (!formData.description?.trim() || (formData.description?.length ?? 0) < 10) {
        newErrors.description = "Description must be at least 10 characters";
      }
    }

    if (currentStep === 2) {
      if (!formData.targetAudience?.trim()) {
        newErrors.targetAudience = "Target audience is required";
      }
      if (!formData.problem?.trim() || (formData.problem?.length ?? 0) < 10) {
        newErrors.problem = "Problem must be at least 10 characters";
      }
      if (!formData.solution?.trim() || (formData.solution?.length ?? 0) < 10) {
        newErrors.solution = "Solution must be at least 10 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3) as Step);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(step) && formData.name && formData.description && formData.targetAudience && formData.problem && formData.solution) {
      await onSubmit(formData as CreateProjectInput);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Validate Your Idea</CardTitle>
        <CardDescription>
          Step {step} of 3 - {step === 1 ? "Basic Info" : step === 2 ? "Audience & Problem" : "Review"}
        </CardDescription>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="My Awesome Idea"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("name", (e.target as HTMLInputElement).value)}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe your idea in 1-2 sentences..."
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("description", (e.target as HTMLTextAreaElement).value)}
                  disabled={isLoading}
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  placeholder="Who is this for? (e.g., small business owners)"
                  value={formData.targetAudience}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("targetAudience", (e.target as HTMLInputElement).value)}
                  disabled={isLoading}
                />
                {errors.targetAudience && (
                  <p className="text-sm text-destructive">{errors.targetAudience}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="problem">Problem</Label>
                <Textarea
                  id="problem"
                  placeholder="What problem does this solve?"
                  value={formData.problem}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("problem", (e.target as HTMLTextAreaElement).value)}
                  disabled={isLoading}
                  rows={3}
                />
                {errors.problem && (
                  <p className="text-sm text-destructive">{errors.problem}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="solution">Solution</Label>
                <Textarea
                  id="solution"
                  placeholder="How does your idea solve this problem?"
                  value={formData.solution}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("solution", (e.target as HTMLTextAreaElement).value)}
                  disabled={isLoading}
                  rows={3}
                />
                {errors.solution && (
                  <p className="text-sm text-destructive">{errors.solution}</p>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Review Your Idea</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {formData.name}
                </div>
                <div>
                  <span className="font-medium">Description:</span> {formData.description}
                </div>
                <div>
                  <span className="font-medium">Target Audience:</span> {formData.targetAudience}
                </div>
                <div>
                  <span className="font-medium">Problem:</span> {formData.problem}
                </div>
                <div>
                  <span className="font-medium">Solution:</span> {formData.solution}
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || isLoading}
          >
            Back
          </Button>
          {step < 3 ? (
            <Button type="button" onClick={handleNext} disabled={isLoading}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
