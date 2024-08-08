import parse from "html-react-parser";
import { Icon, UserAvatar } from "../../../components/Component";
import { capitalizeName, findUpper, formatDateAndTime } from "../../../utils/Utils";
import { Badge } from "reactstrap";
import ReactHtmlParser from 'react-html-parser';
export const ReplyItem = ({ userProfile, ticket, item }) => {
  const { userName, description, commentId, createdOn, email, attachment, role } = item;
  const capitalizedUserName = capitalizeName(userName)
  
  let color;
  if (role == "Admin") {
    color = "success";
  } else if (role == "Employee") {
    color = "primary";
  } else if (role == "Reporting Manager") {
    color = "warning";
  } else if (role == "Tops Executive") {
    color = "danger";
  } else if (role == "CEO") {
    color = "info";
  } else {
    color = "secondary";
  }
 
  function formatDateTime(inputDateTime) {
    const date = new Date(inputDateTime);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    return date.toLocaleString('en-US', options);
  }
  return (
    <div className="nk-reply-item px-0" key={commentId}>
      <div className="nk-reply-header">
        <div className="user-card">
          <UserAvatar theme={(userProfile?.userName == email) ? "primary" : 'light'} size="sm" text={findUpper(capitalizedUserName)} />
          <div className="user-name">
            {userName} <Badge className={"user-card-badge"} color={color}>{role}</Badge>
          </div>
        </div>
        <div className="date-time">{formatDateTime(createdOn)}</div>
      </div>
      <div className="nk-reply-body">
        <div className={`nk-reply-entry entry`}>
          <>{ReactHtmlParser(description)}</>
          {attachment.length > 0 &&
            attachment.map((file) => {
              return (
                <a href={file.url} style={{ whiteSpace: "nowrap" }} className="popup commentAttachment px-1">
                  <Icon name="download" style={{ paddingRight: "5px", fontSize: "20px" }}></Icon>
                  {file.name}
                </a>
              );
            })}
        </div>
        {/* {userProfile?.name != userName && <div className="nk-reply-from">
          Replied by <span>{userName}</span> at {formatDateAndTime(createdOn).formattedTime}
        </div>} */}
      </div>
    </div>
  );
};

export const MetaItem = ({ item }) => {
  return <div className="nk-reply-meta">{parse(item)}</div>;
};