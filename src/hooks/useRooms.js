import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function useRooms(filters = {}) {
  const [state, setState] = useState({ rooms: [], loading: true, error: "" });
  const filterKey = JSON.stringify(filters);
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    setState((previous) => ({ ...previous, loading: true, error: "" }));
    api(`/rooms?${params}`, { signal: controller.signal })
      .then(({ rooms }) => setState({ rooms, loading: false, error: "" }))
      .catch((error) => { if (error.name !== "AbortError") setState({ rooms: [], loading: false, error: error.message }); });
    return () => controller.abort();
  }, [filterKey]); // filterKey deliberately tracks the value rather than object identity
  return state;
}

export function useRoom(slug) {
  const [state, setState] = useState({ room: null, loading: true, error: "" });
  useEffect(() => {
    const controller = new AbortController();
    setState({ room: null, loading: true, error: "" });
    api(`/rooms/${slug}`, { signal: controller.signal })
      .then(({ room }) => setState({ room, loading: false, error: "" }))
      .catch((error) => { if (error.name !== "AbortError") setState({ room: null, loading: false, error: error.message }); });
    return () => controller.abort();
  }, [slug]);
  return state;
}
