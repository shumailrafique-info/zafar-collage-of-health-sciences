import { createAdmission } from "@/app/(web)/actions";
import { AdmissionFormSchemaType } from "@/lib/zod/admission-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY_ADMISSIONS = "admissions" as const;

export function useCreateAdmission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: AdmissionFormSchemaType) => {
            const result = await createAdmission(input);
            if (!result.success) throw new Error(result.error);
            return { id: result.data.id, input };
        },
        onSettled: () => {
            // Invalidate admissions list queries after mutation settles
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ADMISSIONS] });
        },
    });
}