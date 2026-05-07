import { NextRequest, NextResponse } from 'next/server';
import { isDashboardAuthenticated } from '@/lib/auth/dashboard';
import { listEnvVars, createEnvVar, findEnvVar } from '@/lib/mongodb/models/EnvVar';
import { encryptValue, decryptValue } from '@/lib/crypto/envVault';

export async function GET(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const rows = await listEnvVars();
    const items = rows.map((r) => ({
      _id: typeof r._id === 'string' ? r._id : r._id?.toString(),
      project: r.project,
      source: r.source,
      name: r.name,
      value: decryptValue(r.encryptedValue),
      description: r.description || '',
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || 'Error interno' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });

  const project = typeof body.project === 'string' ? body.project.trim() : '';
  const source = typeof body.source === 'string' ? body.source.trim() : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const value = typeof body.value === 'string' ? body.value : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';

  if (!project) return NextResponse.json({ error: 'project requerido' }, { status: 400 });
  if (!source) return NextResponse.json({ error: 'source requerido' }, { status: 400 });
  if (!name || !/^[A-Z0-9_]+$/i.test(name)) {
    return NextResponse.json({ error: 'name inválido (A-Z, 0-9, _)' }, { status: 400 });
  }
  if (!value) return NextResponse.json({ error: 'value requerido' }, { status: 400 });

  const existing = await findEnvVar(project, source, name);
  if (existing) {
    return NextResponse.json(
      { error: `Ya existe ${name} en ${project} (${source})` },
      { status: 409 }
    );
  }

  try {
    const item = await createEnvVar({
      project,
      source,
      name,
      encryptedValue: encryptValue(value),
      description: description || undefined,
    });
    return NextResponse.json({
      item: {
        _id: typeof item._id === 'string' ? item._id : item._id?.toString(),
        project: item.project,
        source: item.source,
        name: item.name,
        value,
        description: item.description || '',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || 'Error interno' },
      { status: 500 }
    );
  }
}
