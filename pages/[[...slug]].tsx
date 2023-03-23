import { GetStaticPaths, GetStaticProps } from "next";

// build-time paths
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getPaths().map((paths) => ({
    params: { slug: paths.split("/") },
  })),
  fallback: false,
});

// get the paths from environment variable or generate page0..pageN
const getPaths = () =>
  process.env.PATHS?.split(",") ??
  Array(100)
    .fill("page")
    .map((page, i) => page + i);

type Props = {
  slug: string[];
  built: string;
};

export const getStaticProps: GetStaticProps<Props, Props> = async ({
  params,
}) => ({
  props: {
    commit: await require("next-build-id")({ dir: __dirname }), // changes every commit
    built: new Date().toString(), // changes every rebuild
    slug: params?.slug ?? [], // never changes
  },
});

const Paths: React.FC<Props> = (props) => (
  <pre>{JSON.stringify(props, null, 2)}</pre>
);

export default Paths;
