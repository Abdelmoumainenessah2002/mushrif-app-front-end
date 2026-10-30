// Configurable destination for "Get Started" once the real product is live.
// While empty, the page shows an honest demo/early-access interaction instead.
export const SIGNUP_URL = "";

export type Role = "Owner" | "Admin" | "Member" | "Viewer";
export const ROLES: Role[] = ["Owner", "Admin", "Member", "Viewer"];

export const roleTone: Record<Role, string> = {
  Owner: "text-primary bg-primary/10 ring-primary/30",
  Admin: "text-sage bg-sage/10 ring-sage/30",
  Member: "text-sky bg-sky/10 ring-sky/30",
  Viewer: "text-muted-foreground bg-muted ring-border",
};

export type Person = { id: string; name: string; email: string; role: Role; hue: string };

export const PEOPLE: Person[] = [
  { id: "1", name: "Layla Haddad", email: "layla@atlas.org", role: "Owner", hue: "bg-primary text-primary-foreground" },
  { id: "2", name: "Omar Benali", email: "omar@atlas.org", role: "Admin", hue: "bg-sage text-background" },
  { id: "3", name: "Sofia Marín", email: "sofia@atlas.org", role: "Member", hue: "bg-sky text-background" },
  { id: "4", name: "Karim Idris", email: "karim@atlas.org", role: "Member", hue: "bg-rose text-background" },
  { id: "5", name: "Nadia Volkov", email: "nadia@atlas.org", role: "Viewer", hue: "bg-foreground text-background" },
];

export const initials = (n: string) => n.split(" ").map((p) => p[0]).join("");

export const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
