'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type ActionResult = { error?: string; success?: boolean };

export async function createStallion(formData: FormData): Promise<ActionResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in.' };
  }

  const name = formData.get('name') as string;
  const breedId = formData.get('breed_id') as string;
  const color = formData.get('color') as string;
  const heightHands = formData.get('height_hands') as string;
  const birthYear = formData.get('birth_year') as string;
  const studFeeDollars = formData.get('stud_fee_dollars') as string;
  const locationCity = formData.get('location_city') as string;
  const locationState = formData.get('location_state') as string;
  const description = formData.get('description') as string;

  if (!name || name.trim().length === 0) {
    return { error: 'Stallion name is required.' };
  }

  const studFeeCents = studFeeDollars ? Math.round(parseFloat(studFeeDollars) * 100) : null;

  const { data, error } = await supabase
    .from('stallions')
    .insert({
      owner_id: user.id,
      name: name.trim(),
      breed_id: breedId ? parseInt(breedId) : null,
      color: color || null,
      height_hands: heightHands ? parseFloat(heightHands) : null,
      birth_year: birthYear ? parseInt(birthYear) : null,
      stud_fee_cents: studFeeCents,
      location_city: locationCity || null,
      location_state: locationState || null,
      description: description || null,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/directory');
  redirect(`/stallions/${data.id}`);
}

export async function updateStallion(stallionId: string, formData: FormData): Promise<ActionResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in.' };
  }

  const name = formData.get('name') as string;
  const breedId = formData.get('breed_id') as string;
  const color = formData.get('color') as string;
  const heightHands = formData.get('height_hands') as string;
  const birthYear = formData.get('birth_year') as string;
  const studFeeDollars = formData.get('stud_fee_dollars') as string;
  const locationCity = formData.get('location_city') as string;
  const locationState = formData.get('location_state') as string;
  const description = formData.get('description') as string;

  if (!name || name.trim().length === 0) {
    return { error: 'Stallion name is required.' };
  }

  const studFeeCents = studFeeDollars ? Math.round(parseFloat(studFeeDollars) * 100) : null;

  // RLS policy ensures only the owner can actually update their row.
  const { error } = await supabase
    .from('stallions')
    .update({
      name: name.trim(),
      breed_id: breedId ? parseInt(breedId) : null,
      color: color || null,
      height_hands: heightHands ? parseFloat(heightHands) : null,
      birth_year: birthYear ? parseInt(birthYear) : null,
      stud_fee_cents: studFeeCents,
      location_city: locationCity || null,
      location_state: locationState || null,
      description: description || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', stallionId)
    .eq('owner_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/directory');
  revalidatePath(`/stallions/${stallionId}`);
  redirect(`/stallions/${stallionId}`);
}

export async function deleteStallion(stallionId: string): Promise<ActionResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in.' };
  }

  const { error } = await supabase
    .from('stallions')
    .delete()
    .eq('id', stallionId)
    .eq('owner_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/directory');
  redirect('/dashboard');
}
