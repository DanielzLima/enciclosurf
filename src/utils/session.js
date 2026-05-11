export function getSessionId() {

  let session = localStorage.getItem("enciclo_session");

  if (!session) {

    session = crypto.randomUUID();

    localStorage.setItem(
      "enciclo_session",
      session
    );
  }

  return session;
}