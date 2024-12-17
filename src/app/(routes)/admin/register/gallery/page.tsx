import React from "react";
import Validation, { required } from "@/app/hooks/validation";

const Gallery = () => {
  const name = Validation("", [required]);
  const description = Validation("", [required]);
  const type = Validation("", [required]);
  const visibility = Validation("", [required]);
  const category = Validation("", [required]);
  const location = Validation("", [required]);
  const academic_year = Validation("", [required]);
  const created_by = Validation("", [required]);
  const tags = Validation("", [required]);

  return <></>;
};

export default Gallery;
