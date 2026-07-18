import Link from 'next/link';
import { PiArrowUpRightThin } from 'react-icons/pi';
import BlurFade from '../ui/blur-fade';
import Safari from '../ui/safari';
import { Badge } from '../ui/badge';
import { Github } from 'lucide-react';
import { featuredProjects } from '@/lib/projects';

const FeaturedCard = ({ project, index, offsetTop }) => {
  return (
    <BlurFade delay={0.25 + index * 0.05} inView>
      <div
        className={`relative flex flex-col justify-start ${
          offsetTop ? 'mt-5 sm:mt-0' : ''
        }`}
      >
        <Link href={`/projects/${project.slug}`} className="block">
          <Safari src={project.image} url={project.url} className="size-full" />
        </Link>
        <div>
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-2 text-xs"></div>
            <div className="project-title text-black">
              <div className="group flex w-[100%] items-center gap-x-3">
                <Link
                  href={`/projects/${project.slug}`}
                  className="cursor-pointer rounded-full bg-white px-3 py-4 drop-shadow-sm"
                >
                  {project.name}
                </Link>
                <a target="_blank" rel="noreferrer" href={project.href}>
                  <div className="flex h-fit cursor-pointer items-center justify-center rounded-full bg-white p-4 text-2xl drop-shadow-sm">
                    <PiArrowUpRightThin className="stroke-black" />
                  </div>
                </a>
                {project.repo ? (
                  <a target="_blank" rel="noreferrer" href={project.repo}>
                    <div className="flex items-center text-3xl text-white">
                      <Github size={30} />
                    </div>
                  </a>
                ) : null}
                {project.live ? (
                  <div className="flex items-center">
                    <div className="loader py-2">
                      <div className="circle">
                        <div className="dot"></div>
                        <div className="outline"></div>
                      </div>
                    </div>
                    <Badge
                      className="bg-rose-300 text-rose-600 outline-red"
                      variant="outline"
                    >
                      Live
                    </Badge>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BlurFade>
  );
};

const Projects = () => {
  return (
    <section className="gap my-16 grid-cols-2 flex-col gap-x-3 gap-y-6 sm:grid">
      {featuredProjects.map((project, index) => (
        <FeaturedCard
          key={project.slug}
          project={project}
          index={index + 1}
          offsetTop={index > 0}
        />
      ))}

      <BlurFade delay={0.25 + 4 * 0.05} inView>
        <div className="relative mt-5 flex flex-col justify-start sm:mt-0">
          <Safari
            src={'/videos/AF.gif'}
            url="aelzel.com"
            className="size-full"
          />
          <div>
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col gap-y-2 text-xs"></div>
              <div className="project-title text-black">
                <a target="_blank" href="https://github.com/Sammk21/AfStore">
                  <div className="group flex w-[100%] items-center gap-x-3">
                    <div className="cursor-pointer rounded-full bg-white px-3 py-4 drop-shadow-sm">
                      AELZEL
                    </div>
                    <div className="flex h-fit cursor-pointer items-center justify-center rounded-full bg-white p-4 text-2xl drop-shadow-sm">
                      <PiArrowUpRightThin className="stroke-black" />
                    </div>
                    <div className="flex items-center text-3xl text-white">
                      <Github size={30} />
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>
      <BlurFade delay={0.25 + 5 * 0.05} inView>
        <div className="relative mt-5 flex flex-col justify-start sm:mt-0">
          <Safari
            src={'/images/dividebyzero.webp'}
            url="dividebyzero.com"
            className="size-full"
          />
          <div>
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col gap-y-2 text-xs"></div>
              <div className="project-title text-black">
                <a
                  target="_blank"
                  href="https://github.com/Sammk21/dbz-store-of"
                >
                  <div className="group flex w-[100%] items-center gap-x-3">
                    <div className="cursor-pointer rounded-full bg-white px-3 py-4 drop-shadow-sm">
                      Divide by zero
                    </div>
                    <div className="flex h-fit cursor-pointer items-center justify-center rounded-full bg-white p-4 text-2xl drop-shadow-sm">
                      <PiArrowUpRightThin className="stroke-black" />
                    </div>
                    <div className="flex items-center text-3xl text-white">
                      <Github size={30} />
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>
      <BlurFade delay={0.25 + 6 * 0.05} inView>
        <div className="relative mt-5 flex flex-col justify-start sm:mt-0">
          <Safari
            src={'/images/onlyeducation.webp'}
            url="onlyeducation.in"
            className="size-full"
          />
          <div>
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col gap-y-2 text-xs"></div>
              <div className="project-title text-black">
                <a target="_blank" href="https://onlyeducation.in">
                  <div className="group flex w-[100%] items-center gap-x-3">
                    <div className="cursor-pointer rounded-full bg-white px-3 py-4 drop-shadow-sm">
                      Only Education
                    </div>
                    <div className="flex h-fit cursor-pointer items-center justify-center rounded-full bg-white p-4 text-2xl drop-shadow-sm">
                      <PiArrowUpRightThin className="stroke-black" />
                    </div>
                    <div className="flex items-center">
                      <div className="loader py-2">
                        <div className="circle">
                          <div className="dot"></div>
                          <div className="outline"></div>
                        </div>
                      </div>
                      <Badge
                        className="bg-rose-300 text-rose-600 outline-red"
                        variant="outline"
                      >
                        Live
                      </Badge>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>
    </section>
  );
};
export default Projects;
