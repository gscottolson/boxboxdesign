import { permanentRedirect } from 'next/navigation';

/** About content lives at `/iracing/project`; keep `/iracing` for bookmarks and external links. */
export default function Page() {
    permanentRedirect('/iracing/project');
}
