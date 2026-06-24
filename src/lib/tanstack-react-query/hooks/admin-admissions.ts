import { getAdmissions, updateAdmissionStatus } from "@/app/(dash)/dashboard/(home)/actions";
import { AdmissionStatusType, AdmissionType } from "@/drizzle/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const QUERY_KEY_ADMISSIONS = "admin-admissions" as const;

export function useAdmissions() {
    return useQuery({
        queryKey: [QUERY_KEY_ADMISSIONS],
        queryFn: async () => {
            const result = await getAdmissions();
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
    });
}

export function useUpdateAdmissionStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: AdmissionStatusType }) => {
            const result = await updateAdmissionStatus(id, status);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        // Optimistic update
        onMutate: async ({ id, status }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: [QUERY_KEY_ADMISSIONS] });

            // Snapshot previous data
            const previous = queryClient.getQueryData<AdmissionType[]>([QUERY_KEY_ADMISSIONS]);

            // Optimistically update the cache
            if (previous) {
                queryClient.setQueryData<AdmissionType[]>(
                    [QUERY_KEY_ADMISSIONS],
                    previous.map((admission) =>
                        admission.id === id ? { ...admission, status } : admission
                    )
                );
            }

            return { previous };
        },
        // If error, rollback to previous state
        onError: (err, variables, context) => {
            if (context?.previous) {
                queryClient.setQueryData([QUERY_KEY_ADMISSIONS], context.previous);
            }
            toast.error(err.message || "Failed to update status");
        },
        // Always refetch after success or error
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ADMISSIONS] });
        },
        onSuccess: (data) => {
            toast.success(`Status updated to ${data.status}`);
        },
    });
}