import Page from '@/components/Page';
import CustomCursor from '@/components/custom-crusor/Cursor';
import RecentWork from '@/components/Recent-Work';
import Hero2 from '@/components/Layout/Hero2';
import AboutMe from '@/components/About-me';
import Wrapper from '@/components/Wrapper';
import AppContext from '@/context/globalContext';

export default function Home() {
  return (
    <AppContext>
      <div className="flex min-h-screen flex-col">
        <CustomCursor />
        <Page>
          <Hero2 />
          <Wrapper>
            <AboutMe />
            <RecentWork />
          </Wrapper>
        </Page>
      </div>
    </AppContext>
  );
}
