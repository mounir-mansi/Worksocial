import { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { hostname } from "../HostnameConnect/Hostname";

const SurveyContext = createContext(null);

export function useSurvey() {
  return useContext(SurveyContext);
}

export function SurveyProvider({ children }) {
  const [surveys, setSurveys] = useState([]);
  const [votes, setVotes] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);

  const getSurveys = async () => {
    try {
      const response = await fetch(`${hostname}/surveys`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setSurveys(data);
      }
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  const getVotes = async () => {
    try {
      const voteRequests = surveys.map(async (survey) => {
        const response = await fetch(
          `${hostname}/surveys/${survey.Survey_ID}/votes`,
          {
            credentials: 'include',
          }
        );
        if (response.ok) {
          return response.json();
        }
        return null;
      });

      const allVotes = await Promise.all(voteRequests);
      const flattenedVotes = allVotes.flat();
      setVotes(flattenedVotes);
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  const getComments = async () => {
    try {
      const commentRequests = surveys.map(async (survey) => {
        const response = await fetch(
          `${hostname}/surveys/${survey.Survey_ID}/comments`,
          {
            credentials: 'include',
          }
        );
        if (response.ok) {
          return response.json();
        }
        return null;
      });

      const allComments = await Promise.all(commentRequests);
      const flattenedComments = allComments.flat();
      setComments(flattenedComments);
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  const getLikes = async () => {
    try {
      const likeRequests = surveys.map(async (survey) => {
        const response = await fetch(
          `${hostname}/surveys/${survey.Survey_ID}/likes`,
          {
            credentials: 'include',
          }
        );
        if (response.ok) {
          return response.json();
        }
        return null;
      });

      const allLikes = await Promise.all(likeRequests);
      const flattenedLikes = allLikes.flat();
      setLikes(flattenedLikes);
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  const value = useMemo(
    () => ({
      surveys,
      setSurveys,
      getSurveys,
      votes,
      setVotes,
      getVotes,
      comments,
      setComments,
      getComments,
      likes,
      setLikes,
      getLikes,
    }),
    [surveys, votes, comments, likes]
  );
  return (
    <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>
  );
}

SurveyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
