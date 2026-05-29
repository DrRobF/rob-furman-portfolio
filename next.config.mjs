/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/human-equation-suite/learn',
        destination: '/human-equation-suite/course',
        permanent: false,
      },
      {
        source: '/human-equation',
        destination: '/human-equation-suite/parent-call',
        permanent: false,
      },
      {
        source: '/simulation-overview',
        destination: '/human-equation-suite/leadership-sim',
        permanent: false,
      },
      {
        source: '/simulations/urban-student',
        destination: '/human-equation-suite/urban-student-sim',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
