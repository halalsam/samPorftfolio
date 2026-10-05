import Page from '@/components/Page';
import Wrapper from '@/components/Wrapper';
import CustomCursor from '@/components/custom-crusor/Cursor';
import AppContext from '@/context/globalContext';
import ContactSheet from '@/components/Contact';

export const metadata = {
  title: 'Sameer | Contact',
  description: 'Email, phone and social links for Sam, a full-stack developer and designer.',
  icons: {
    icon: '/favicon.ico',
  },
};

// The footer carries the same details, so it's left off this page.
export default function Contact() {
  return (
    <AppContext>
      <div className="flex min-h-screen flex-col">
        <CustomCursor />
        <Page showPreloader={false} showFooter={false}>
          <Wrapper>
            <ContactSheet />
          </Wrapper>
        </Page>
      </div>
    </AppContext>
  );
}
