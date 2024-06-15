import { ApolloError } from "@apollo/client";
import { toast } from "react-toastify";
import { ErrorCode } from "@/_enums";

export default function graphQLError(error: ApolloError) {
    const errorMessage: string = extractErrorMessage(error)
    if (errorMessage) {
        toast.error(errorMessage, {
            toastId: errorMessage
        })
    }
}


function extractErrorMessage(error: ApolloError | undefined): string {
    if (error) {
        const queryErrorType = error.graphQLErrors?.[0]?.extensions?.code as keyof typeof ErrorCode;
        const queryErrorMessage = error.graphQLErrors?.[0]?.message as string;

        if (queryErrorType && ErrorCode[queryErrorType]) {
            return queryErrorMessage;
        }
    }

    return "";
}