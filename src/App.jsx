import Academy from "./AcademApp";
import { UsersProvider } from "./hooks/UsersContext";

function App() {
  return (
    <>
      <UsersProvider>
        <Academy />
      </UsersProvider>
    </>
  );
}

export default App;
