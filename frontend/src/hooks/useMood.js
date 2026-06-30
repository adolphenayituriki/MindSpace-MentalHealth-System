import { useState, useCallback } from 'react';
import { moodAPI } from '../services/api';

export function useMood() {
  const [moods, setMoods] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logMood = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await moodAPI.log(data);
      setMoods(res.data.moods || []);
      setStreak(res.data.streak || 0);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMoods = useCallback(async (days) => {
    setLoading(true);
    try {
      const res = await moodAPI.getAll(days);
      setMoods(res.data.moods || []);
      setStreak(res.data.streak || 0);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { moods, streak, loading, error, logMood, fetchMoods };
}
