import { MotionConfig } from "framer-motion";
import Router from "./routes/Router";

const App = () => {
  return (
    <MotionConfig reducedMotion="user">
      <Router />
    </MotionConfig>
  );
};

export default App;
