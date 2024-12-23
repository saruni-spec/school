import React, { useState } from "react";
import { Button } from "@/app/components/button";
import { Input } from "@/app/components/input";
import RadioInputs from "@/app/components/radio";
import { generic_record } from "@/app/types/types";

type QuestionType = "open" | "multiple";
type Option = {
  id: string;
  text: string;
};

type Question = {
  id: string;
  text: string;
  type: QuestionType;
  options?: Option[];
};

const QuestionCreator = ({
  onSubmit,
}: {
  onSubmit: (questions: Question[]) => void;
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>("open");
  const [options, setOptions] = useState<Option[]>([]);
  const [currentOption, setCurrentOption] = useState("");

  const questionTypeOptions = [
    { id: "open", name: "Open Question" },
    { id: "multiple", name: "Multiple Choice" },
  ];

  const handleQuestionTypeChange = (record: generic_record) => {
    setQuestionType(record.id as QuestionType);
    setOptions([]);
  };

  const addOption = () => {
    if (currentOption.trim()) {
      setOptions([
        ...options,
        { id: `opt-${Date.now()}`, text: currentOption.trim() },
      ]);
      setCurrentOption("");
    }
  };

  const removeOption = (optionId: string) => {
    setOptions(options.filter((opt) => opt.id !== optionId));
  };

  const addQuestion = () => {
    if (currentQuestion.trim()) {
      const newQuestion: Question = {
        id: `q-${Date.now()}`,
        text: currentQuestion.trim(),
        type: questionType,
        options: questionType === "multiple" ? options : undefined,
      };

      setQuestions([...questions, newQuestion]);
      setCurrentQuestion("");
      setOptions([]);
      setQuestionType("open");
    }
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const handleSubmitQuestions = () => {
    onSubmit(questions);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <RadioInputs
          label="Question Type"
          options={questionTypeOptions}
          name="question-type"
          value={questionType}
          onChange={handleQuestionTypeChange}
          orientation="horizontal"
        />

        <Input
          label="Question"
          type="text"
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          placeholder="Enter your question here"
        />

        {questionType === "multiple" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                label="Option"
                type="text"
                value={currentOption}
                onChange={(e) => setCurrentOption(e.target.value)}
                placeholder="Enter an option"
              />
              <Button onClick={addOption} className="mt-6" variant="primary">
                Add Option
              </Button>
            </div>

            {options.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium">Options:</p>
                {options.map((option) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <span>• {option.text}</span>
                    <Button
                      type="button"
                      onClick={() => removeOption(option.id)}
                      variant="danger"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <Button
          onClick={addQuestion}
          className="w-full"
          variant="primary"
          disabled={
            !currentQuestion.trim() ||
            (questionType === "multiple" && options.length < 2)
          }
        >
          Add Question
        </Button>
      </div>

      {questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Created Questions:</h3>
          {questions.map((question) => (
            <div key={question.id} className="p-4 border rounded-lg space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{question.text}</p>
                  {question.options && (
                    <ul className="mt-2 ml-4">
                      {question.options.map((opt) => (
                        <li key={opt.id}>• {opt.text}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={() => removeQuestion(question.id)}
                  variant="danger"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}

          <Button
            onClick={handleSubmitQuestions}
            className="w-full"
            variant="success"
          >
            Submit All Questions
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuestionCreator;
