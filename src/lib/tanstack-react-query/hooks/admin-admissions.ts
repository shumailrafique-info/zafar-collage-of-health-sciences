import { getAdmissions } from "@/app/(dash)/dashboard/(home)/actions";
import { useQuery } from "@tanstack/react-query";

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