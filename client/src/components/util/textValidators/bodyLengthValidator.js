import React, { Component } from "react";

export const validataBodyLength = (body, length) => {
  if (body.length > length) {
    return { error: "Cannot be greater than 300 characters" };
  }
  return null;
};
