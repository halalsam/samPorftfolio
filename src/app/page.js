import Page from '@/components/Page';
import CustomCursor from '@/components/custom-crusor/Cursor';
import RecentWork from '@/components/Recent-Work';
import Hero2 from '@/components/Layout/Hero2';
import AboutMe from '@/components/About-me';
import Wrapper from '@/components/Wrapper';
import AppContext from '@/context/globalContext';
import JsonLd from '@/components/JsonLd';
import { getCaseStudies, getWorkCards } from '@/lib/content';
import { SITE, pageMetadata, profilePageJsonLd } from '@/lib/site';

export const metadata = pageMetadata({ title: SITE.title, path: '/', absoluteTitle: true });

export default async function Home() {
  const [cards, caseStudies] = await Promise.all([getWorkCards(), getCaseStudies()]);
  return (
    <AppContext>
      <JsonLd data={profilePageJsonLd(caseStudies)} />
      <div className="flex min-h-screen flex-col">
        <CustomCursor />
        <Page>
          <Hero2 />
          <Wrapper>
            <AboutMe />
            <RecentWork cards={cards} />
          </Wrapper>
        </Page>
      </div>
    </AppContext>
  );
}
