import { ApiResponse } from "@/lib/types/global";
import { useMutation } from "@tanstack/react-query";


type CheckEmailExistsResponse = ApiResponse<{
    exists: boolean;
}>;

export const useCheckEmailExists = () => {
    return useMutation({
        mutationFn: async (email: string) => {
            const res = await fetch("/api/check/email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data: CheckEmailExistsResponse = await res.json();

            if (!data.success) {
                throw new Error(data.error);
            }

            return data.data;
        },
    });
};