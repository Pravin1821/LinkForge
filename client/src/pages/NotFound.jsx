import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <Card className="rounded-2xl p-6 md:p-8">
      <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-zinc-400">That route doesn’t exist.</p>
      <div className="mt-4">
        <Link to="/">
          <Button variant="primary">Back to dashboard</Button>
        </Link>
      </div>
    </Card>
  );
}
