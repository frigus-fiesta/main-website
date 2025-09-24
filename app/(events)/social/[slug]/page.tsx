import SocialEventClientPage from "./SocialEventClientPage"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  return <SocialEventClientPage slug={slug}/>;
}