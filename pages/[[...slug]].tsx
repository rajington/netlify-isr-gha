import { GetStaticPaths, GetStaticProps } from "next";

// build-time paths
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (process.env.PATHS ?? "").split(",").map((paths) => ({
    params: { slug: paths.split("/") },
  })),
  fallback: false,
});

type Props = {
  slug: string[];
  built: string;
};

export const getStaticProps: GetStaticProps<Props, Props> = async ({
  params,
}) => ({
  props: { slug: params?.slug ?? [], built: new Date().toString() },
});

const Paths: React.FC<Props> = (props) => (
  <pre>{JSON.stringify(props, null, 2)}</pre>
);

export default Paths;
