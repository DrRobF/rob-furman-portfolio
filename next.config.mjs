/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/human-equation-suite/learn',
        destination: '/human-equation-suite/course',
        permanent: true,
      },
      {
        source: '/human-equation',
        destination: '/human-equation-suite/parent-call',
        permanent: true,
      },
      {
        source: '/simulation-overview',
        destination: '/human-equation-suite/leadership-sim',
        permanent: true,
      },
      {
        source: '/simulations/urban-student',
        destination: '/human-equation-suite/urban-student-sim',
        permanent: true,
      },
      {
        source: '/simulation',
        destination: '/human-equation-suite/leadership-sim',
        permanent: true,
      },
      {
        source: '/simulations/principal',
        destination: '/human-equation-suite/leadership-sim',
        permanent: true,
      },
      {
        source: '/simulations',
        destination: '/human-equation-suite/leadership-sim',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
