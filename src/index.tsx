import * as React from "react";
import { render } from "react-dom";
import { useQuery, ReactQueryConfigProvider } from "react-query";

import "./styles.css";

interface IFetchProjects {
  username: string;
}

export async function fetchProjects({ username }: IFetchProjects) {
  return (await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated`
  )).json();
}

interface IFetchProject extends IFetchProjects {
  id: number;
}

export async function fetchProject({ username, id }: IFetchProject) {
  return (await fetch(`https://api.github.com/repos/${username}/${id}`)).json();
}

interface IProjectProps {
  username: string;
  selectedProjectId: null | number;
  setSelectedProjectId: (id: number) => void;
}

export const Projects = ({
  username,
  setSelectedProjectId,
  selectedProjectId
}: IProjectProps) => {
  const { data, isFetching } = useQuery(
    ["projects", { username }],
    fetchProjects
  );

  return (
    <div>
      <h1>Projects {isFetching ? "..." : null}</h1>
      <ul>
        {data.map(project => (
          <li key={project.id} onClick={() => setSelectedProjectId(project.id)}>
            {project.name} {selectedProjectId === project.id && "*"}
          </li>
        ))}
      </ul>
    </div>
  );
};

const queryConfig = {
  suspense: true
};

function App() {
  const [selectedProjectId, setSelectedProjectId] = React.useState<
    null | number
  >(null);
  const username = "tannerlinsley";

  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <React.Suspense fallback={<h1>Loading projects...</h1>}>
        <Projects
          username={username}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
        />
      </React.Suspense>
    </ReactQueryConfigProvider>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
