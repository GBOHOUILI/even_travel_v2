import { useMutation, useQueryClient } from "@tanstack/react-query";

import { blogApi } from "@/features/blog/api/blog.api";
import { blogKeys } from "@/features/blog/api/blog.keys";
import { buildArticleFormData } from "@/features/blog/lib/articleFormMapper";
import type { ArticleFormValues } from "@/features/blog/lib/articleFormSchema";

export function useSaveArticle(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ArticleFormValues) => {
      const formData = buildArticleFormData(values);
      return id ? blogApi.update(id, formData) : blogApi.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.admin.all });
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}
