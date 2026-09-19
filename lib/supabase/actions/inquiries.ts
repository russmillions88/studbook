'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type InquiryResult = { error?: string; success?: boolean };

export async function submitInquiry(stallionId: string, formData: FormData): Promise<InquiryResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  if (!name || !email) {
    return { error: 'Name and email are required.' };
  }

  const { error } = await supabase.from('inquiries').insert({
    stallion_id: stallionId,
    from_user_id: user?.id || null,
    from_name: name,
    from_email: email,
    message: message || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/stallions/${stallionId}`);
  return { success: true };
}
