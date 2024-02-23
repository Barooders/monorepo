import Collapse from '.';

type PropsType = {
  title: string;
  content: string;
};

const SimpleCollapse: React.FC<PropsType> = ({ title, content }) => (
  <Collapse
    renderTitle={() => <div dangerouslySetInnerHTML={{ __html: title }} />}
    ContentComponent={() => (
      <div dangerouslySetInnerHTML={{ __html: content }} />
    )}
  />
);

export default SimpleCollapse;
