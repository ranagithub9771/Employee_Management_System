"use client";
import { useState } from "react";
import Link from "next/link";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  salary: "",
  joiningDate: "",
  status: "Active",
};

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Name must be at least 2 characters";
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = "Enter a valid email";
  if (!/^[0-9+\-\s()]{7,15}$/.test(v.phone.trim()))
    e.phone = "Enter a valid phone number (7-15 digits)";
  if (!v.department.trim()) e.department = "Department is required";
  if (!v.designation.trim()) e.designation = "Designation is required";
  if (v.salary === "" || Number(v.salary) < 0 || Number.isNaN(Number(v.salary)))
    e.salary = "Enter a valid salary (0 or more)";
  if (!v.joiningDate) e.joiningDate = "Joining date is required";
  return e;
}

export default function EmployeeForm({ initial, onSubmit, submitLabel }) {
  const [values, setValues] = useState({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const handle = async (e) => {
    e.preventDefault();
    setFormError("");
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      await onSubmit({ ...values, salary: Number(values.salary) });
    } catch (err) {
      setErrors(err.fieldErrors || {});
      setFormError(err.message);
      setSubmitting(false);
    }
  };

  const field = (k, label, props = {}) => (
    <div className="field">
      <label htmlFor={k}>{label}</label>
      <input
        id={k}
        value={values[k]}
        onChange={set(k)}
        className={errors[k] ? "invalid" : ""}
        {...props}
      />
      {errors[k] && <span className="error-text">{errors[k]}</span>}
    </div>
  );

  return (
    <form onSubmit={handle} className="card form-grid" noValidate>
      {formError && <div className="alert alert-error full">{formError}</div>}
      {field("name", "Name", { placeholder: "Jane Doe" })}
      {field("email", "Email", {
        type: "email",
        placeholder: "jane@company.com",
      })}
      {field("phone", "Phone", { placeholder: "+91 9876543210" })}
      {field("department", "Department", { placeholder: "Engineering" })}
      {field("designation", "Designation", {
        placeholder: "Software Engineer",
      })}
      {field("salary", "Salary", {
        type: "number",
        min: 0,
        placeholder: "60000",
      })}
      {field("joiningDate", "Joining Date", { type: "date" })}
      <div className="field">
        <label htmlFor="status">Status</label>
        <select id="status" value={values.status} onChange={set("status")}>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
      <div className="full form-actions">
        <Link href="/employees" className="btn btn-outline">
          Cancel
        </Link>
        <button className="btn" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
