import { Card, CardContent } from "@/app/components/card";
import { Alert } from "@/app/components/alert";
import prisma from "@/lib/prisma";

interface UserProfileProps {
  userId: number;
}

export async function UserProfile({ userId }: UserProfileProps) {
  // Fetch user data with schedules and events
  const schedule = await prisma.schedule_event.findMany({
    where: { schedule: { users_id: userId } },
    select: {
      id: true,
      for: true,
      at_place: true,
      at_time: true,
      priority: true,
      notes: true,
      recurr_for: true,
    },
  });
  if (!schedule) return <div>Nothing on schedule</div>;

  return (
    <div className="container mx-auto p-6">
      {/* Schedules Section */}
      <h2 className="text-2xl font-bold mb-4">Schedules</h2>
      <div className="space-y-6">
        {schedule?.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div key={event.id} className="border-l-4 pl-4 border-primary">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{event.for}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.at_time).toLocaleString()}
                      </p>
                    </div>
                    <Alert variant={event.priority.toLowerCase()}>
                      {event.priority}
                    </Alert>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <span className="ml-2">{event.at_place}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recurrence:</span>
                      <span className="ml-2 capitalize">
                        {event.recurr_for.toLowerCase()}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Notes:</span>
                      <p className="mt-1 text-foreground">{event.notes}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
