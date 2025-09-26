import { FC } from "react";
import { Member } from "@/types/networkMember";

interface NetworkMembersSectionProps {
  members: Member[];
}

const NetworkMembersSection: FC<NetworkMembersSectionProps> = ({ members }) => {

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Network Members</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Member ID</th>
              <th className="py-2 px-4 border-b">Address</th>
              <th className="py-2 px-4 border-b">IP Assignments</th>
              <th className="py-2 px-4 border-b">Authorized</th>
              <th className="py-2 px-4 border-b">Last Authorized</th>
              <th className="py-2 px-4 border-b">Creation Time</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{member.id}</td>
                <td className="py-2 px-4 border-b">{member.address}</td>
                <td className="py-2 px-4 border-b">
                  {member.ipAssignments.join(", ")}
                </td>
                <td className="py-2 px-4 border-b">
                  {member.authorized ? "Yes" : "No"}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(member.lastAuthorizedTime).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(member.creationTime).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NetworkMembersSection;
