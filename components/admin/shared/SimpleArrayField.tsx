"use client";

import {
  useFieldArray,
  type Control,
  type FieldArrayPath,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";

interface SimpleArrayFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  name: FieldArrayPath<TFieldValues>;
  itemLabel: string;
  addLabel: string;
  placeholder?: string;
}

/**
 * Suppose que `name` pointe vers un tableau d'objets `{ value: string }`
 * (ex: servicesInclus, momentsForts, langues, sitesVisiter, gastronomie).
 */
export function SimpleArrayField<TFieldValues extends FieldValues>({
  control,
  register,
  name,
  itemLabel,
  addLabel,
  placeholder,
}: SimpleArrayFieldProps<TFieldValues>) {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="admin-form-array">
      {fields.map((field, index) => (
        <div key={field.id} className="admin-array-item">
          <div className="admin-array-header">
            <strong>
              {itemLabel} {index + 1}
            </strong>
            {fields.length > 1 && (
              <button
                type="button"
                className="admin-remove-array-item"
                onClick={() => remove(index)}
                aria-label={`Supprimer ${itemLabel.toLowerCase()} ${index + 1}`}
              >
                ×
              </button>
            )}
          </div>
          <input
            type="text"
            placeholder={placeholder}
            {...register(`${name}.${index}.value` as Path<TFieldValues>)}
          />
        </div>
      ))}
      <button
        type="button"
        className="admin-add-array-btn"
        onClick={() => append({ value: "" } as never)}
      >
        + {addLabel}
      </button>
    </div>
  );
}
