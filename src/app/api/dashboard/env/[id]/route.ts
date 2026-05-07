import { NextRequest, NextResponse } from 'next/server';
import { isDashboardAuthenticated } from '@/lib/auth/dashboard';
import { updateEnvVar, deleteEnvVar } from '@/lib/mongodb/models/EnvVar';
import { encryptValue } from '@/lib/crypto/envVault';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (typeof body.project === 'string') patch.project = body.project.trim();
  if (typeof body.source === 'string') patch.source = body.source.trim();
  if (typeof body.name === 'string') {
    const name = body.name.trim();
    if (!/^[A-Z0-9_]+$/i.test(name)) {
      return NextResponse.json({ error: 'name inválido (A-Z, 0-9, _)' }, { status: 400 });
    }
    patch.name = name;
  }
  if (typeof body.value === 'string') {
    if (!body.value) {
      return NextResponse.json({ error: 'value vacío' }, { status: 400 });
    }
    patch.encryptedValue = encryptValue(body.value);
  }
  if (typeof body.description === 'string') {
    patch.description = body.description.trim();
  }

  try {
    const updated = await updateEnvVar(id, patch);
    if (!updated) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || 'Error interno' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const { id } = await params;
  const ok = await deleteEnvVar(id);
  if (!ok) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
