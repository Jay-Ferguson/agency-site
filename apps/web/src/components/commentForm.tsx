import { useState } from "react";
import { type FieldErrors, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

type CommentFormData = {
  _id: string;
  name: string;
  email: string;
  comment: string;
}
type CommentFormProps = FieldErrors<CommentFormData>;

export function Form({ _id }: { _id: string }) {
  const [formData, setFormData] = useState<CommentFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentFormData>();

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true);
    setFormData(data);

    try {
      await fetch("/api/createComment", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setHasSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <h3>Submitting comment…</h3>;
  }

  if (hasSubmitted && formData) {
    return (
      <>
        <h3>Thanks for your comment!</h3>
        <ul>
          <li>
            Name: {formData.name} <br />
            Email: {formData.email} <br />
            Comment: {formData.comment}
          </li>
        </ul>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
      <input {...register("_id")} type="hidden" value={_id} />

      <label className="block mb-5">
        <span className="text-gray-700">Name</span>
        <input
          {...register("name", { required: "Name is required" })}
          className="form-input mt-1 block w-full"
          placeholder="John Appleseed"
        />
        <ErrorMessage<CommentFormProps>
          errors={errors}
          name="name"
          render={({ message }) =>
            message ? (
              <span className="text-red-500 text-sm mt-1">{message}</span>
            ) : null
          }
        />
      </label>

      <label className="block mb-5">
        <span className="text-gray-700">Email</span>
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          type="email"
          className="form-input mt-1 block w-full"
          placeholder="your@email.com"
        />
        <ErrorMessage<CommentFormProps>
          errors={errors}
          name="email"
          render={({ message }) =>
            message ? (
              <span className="text-red-500 text-sm mt-1">{message}</span>
            ) : null
          }
        />
      </label>

      <label className="block mb-5">
        <span className="text-gray-700">Comment</span>
        <textarea
          {...register("comment", { required: "Comment is required" })}
          className="form-textarea mt-1 block w-full"
          rows={8}
          placeholder="Enter some long form content."
        ></textarea>
        <ErrorMessage<CommentFormProps>
          errors={errors}
          name="comment"
          render={({ message }) =>
            message ? (
              <span className="text-red-500 text-sm mt-1">{message}</span>
            ) : null
          }
        />
      </label>

      {/* errors will return when field validation fails */}
      <input
        type="submit"
        className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
      />
    </form>
  );
}
