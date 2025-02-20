"use client";
import React, { Suspense } from "react";
import {
  gallery_type,
  gallery_visibility,
  picture_category,
} from "@prisma/client";
import { Form } from "@/app/components/form";
import { MyInput } from "@/app/components/input";
import { SelectList } from "@/app/components/select_list";
import { useUser } from "@/app/context/user_context";
import { register } from "@/app/api_functions/functions";
import { useValidation } from "@/app/hooks/validation_hooks";
import { FieldType } from "@/app/types/types";
import { validInputs } from "@/lib/functions";
import { LoadingSpinner } from "@/app/components/loading";
//
// Create a new gallery
const Gallery = () => {
  const name = useValidation({ type: FieldType.Text, required: true });
  const description = useValidation({ type: FieldType.Text, required: true });
  const type = useValidation({ type: FieldType.Text, required: true });
  const visibility = useValidation({ type: FieldType.Text, required: true });
  const category = useValidation({ type: FieldType.Text, required: true });
  const location = useValidation({ type: FieldType.Text, required: true });
  const tags = useValidation({ type: FieldType.Text, required: true });

  const { user } = useUser();

  const gallery_types = Object.keys(gallery_type);
  const visibility_types = Object.keys(gallery_visibility);
  const categories = Object.keys(picture_category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !validInputs([
        name,
        description,
        type,
        visibility,
        category,
        location,
        tags,
      ])
    )
      return;

    await register({
      data: {
        name: name.value,
        description: description.value,
        type: type.value,
        visibility: visibility.value,
        category: category.value,
        location: location.value,
        tags: tags.value,
        created_by: user ? user.id : null,
      },
      model_name: "gallery",
    });
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Form
        onSubmit={handleSubmit}
        submitButtonText="Save Gallery"
        title="Create Gallery"
      >
        <MyInput
          label="Gallery Name"
          placeholder="Name"
          value={name.value}
          onChange={name.handle_change}
          error={name.error}
        />
        <MyInput
          label="Description"
          placeholder="Description"
          value={description.value}
          onChange={description.handle_change}
          error={description.error}
        />
        <SelectList
          label="Gallery Type"
          placeholder="Select Gallery Type"
          value={type.value}
          onChange={type.handle_change}
          error={type.error}
          options={gallery_types}
        />
        <SelectList
          label="Who can see this gallery?"
          placeholder="Select Visibility"
          value={visibility.value}
          onChange={visibility.handle_change}
          error={visibility.error}
          options={visibility_types}
        />
        <SelectList
          label="Category"
          value={category.value}
          onChange={category.handle_change}
          error={category.error}
          options={categories}
        />
        <MyInput
          label="Where are the pictures taken?"
          placeholder="Location"
          value={location.value}
          onChange={location.handle_change}
          error={location.error}
        />
        <MyInput
          label="Tags"
          placeholder="Tags"
          value={tags.value}
          onChange={tags.handle_change}
          error={tags.error}
        />
      </Form>
    </Suspense>
  );
};

export default Gallery;
