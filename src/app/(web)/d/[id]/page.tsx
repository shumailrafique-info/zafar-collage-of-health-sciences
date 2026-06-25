import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import AdmissionSheetPage from './client-page'
import { db } from '@/drizzle/db'
import { admissionForms } from '@/drizzle/schema'

type Props = {
    params: Promise<{ id: string }>
}

const Page = async ({ params }: Props) => {
    const { id } = await params
    const admissionRecord = await db.query.admissionForms.findFirst({
        where: eq(admissionForms.id, id),
    })

    if (!admissionRecord) return notFound()
    return (
        <>
            <AdmissionSheetPage admissionRecord={admissionRecord} />
        </>
    )
}

export default Page
