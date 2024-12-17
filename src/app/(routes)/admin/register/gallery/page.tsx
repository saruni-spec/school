"use client";
import React from "react";
import Validation, { required } from "@/app/hooks/validation";
import {
  gallery_type,
  gallery_visibility,
  picture_category,
} from "@prisma/client";
import { Form } from "@/app/components/form";
import { Input } from "@/app/components/input";
import { SelectList } from "@/app/components/select_list";
import { useUser } from "@/app/context/user_context";

const Gallery = () => {
  const name = Validation("", [required]);
  const description = Validation("", [required]);
  const type = Validation("", [required]);
  const visibility = Validation("", [required]);
  const category = Validation("", [required]);
  const location = Validation("", [required]);
  const tags = Validation("", [required]);

  const { user } = useUser();

  const gallery_types = Object.keys(gallery_type);
  const visibility_types = Object.keys(gallery_visibility);
  const categories = Object.keys(picture_category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const is_form_valid = [
      name,
      description,
      type,
      visibility,
      category,
      location,
      tags,
    ].every((field) => field.validate(field.value));
    if (!is_form_valid) return;

    await fetch("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify({
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
      }),
    });
  };

  return (
    <Form
      onSubmit={handleSubmit}
      submitButtonText="Save Gallery"
      title="Create Gallery"
    >
      <Input
        label="Gallery Name"
        placeholder="Name"
        value={name.value}
        onChange={name.handle_change}
        error={name.error}
      />
      <Input
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
      <Input
        label="Where are the pictures taken?"
        placeholder="Location"
        value={location.value}
        onChange={location.handle_change}
        error={location.error}
      />
      <Input
        label="Tags"
        placeholder="Tags"
        value={tags.value}
        onChange={tags.handle_change}
        error={tags.error}
      />
    </Form>
  );
};

export default Gallery;
