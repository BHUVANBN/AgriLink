/**
 * Private document storage on Cloudinary (free tier).
 *
 * Aadhaar / RTC / land sketches are uploaded with `type: 'private'`, so the
 * normal CDN URL returns 401. We store a `cloudinary-private://` reference
 * and hand out short-lived signed download URLs only to the owner or an
 * admin. Older rows that still hold a public https URL are passed through.
 */
import { v2 as cloudinary } from 'cloudinary';

const SCHEME = 'cloudinary-private://';
const URL_TTL_SECONDS = 15 * 60;

export function toPrivateRef(result: { resource_type: string; public_id: string; format?: string }): string {
  return `${SCHEME}${result.resource_type}/${result.format ?? ''}/${result.public_id}`;
}

export function signedUrlFor(ref: string | null | undefined): string | null {
  if (!ref) return null;
  if (!ref.startsWith(SCHEME)) return ref; // legacy public URL
  const rest = ref.slice(SCHEME.length);
  const [resourceType, format, ...idParts] = rest.split('/');
  const publicId = idParts.join('/');
  return cloudinary.utils.private_download_url(publicId, format || '', {
    resource_type: resourceType as any,
    type: 'private',
    expires_at: Math.floor(Date.now() / 1000) + URL_TTL_SECONDS,
  });
}

const DOC_FIELDS = ['aadhaarCloudUrl', 'rtcCloudUrl', 'landSketchUrl'] as const;

/** Replace stored private refs with fresh signed URLs before returning a profile. */
export function presentProfile<T extends Record<string, any> | null>(profile: T): T {
  if (!profile) return profile;
  const out: Record<string, any> = { ...profile };
  for (const f of DOC_FIELDS) if (f in out) out[f] = signedUrlFor(out[f]);
  return out as T;
}

export function uploadPrivate(buffer: Buffer, folder: string, filename: string) {
  return new Promise<{ resource_type: string; public_id: string; format?: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: `agrilink/${folder}`,
        type: 'private',
        resource_type: 'auto',
        public_id: filename,
        overwrite: true,
      },
      (err, result) => (err || !result ? reject(err ?? new Error('upload failed')) : resolve(result as any)),
    ).end(buffer);
  });
}
