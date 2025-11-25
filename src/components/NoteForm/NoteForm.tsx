import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import css from "./NoteForm.module.css";
import { toast } from "react-hot-toast";
import type { NoteTag } from "../../types/note";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

const NoteForm: React.FC<NoteFormProps> = ({ onCancel }) => {
  const queryClient = useQueryClient();

  const { mutate: createNoteMutate } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created!");
      onCancel();
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  return (
    <Formik
      initialValues={{
        title: "",
        content: "",
        tag: "Todo" as NoteTag,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        createNoteMutate(values);
      }}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" name="title" type="text" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default NoteForm;
