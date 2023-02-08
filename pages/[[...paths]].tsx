import { GetStaticPaths, GetStaticProps } from "next";

type Props = {
  paths: string[];
  built: string;
};

// build-time paths
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [
    {
      params: { paths: [""] },
    },
    { params: { paths: ["nested", "path"] } },
  ],
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props, Props> = async ({
  params,
}) => ({
  props: { paths: params?.paths ?? [], built: new Date().toString() },
});

const Paths: React.FC<Props> = (props) => (
  <pre>{JSON.stringify(props, null, 2)}</pre>
);

export default Paths;
