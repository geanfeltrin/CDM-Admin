import React from "react";
import {
  MDBPagination,
  MDBPageItem,
  MDBPageNav,
  MDBCol,
  MDBRow
} from "mdbreact";

const PaginationPage = ({ clickNumber, ...props }) => {
  const range = N => Array.from({ length: N }, (v, k) => k + 1);
  const total = range(props.total);
  return (
    <MDBRow>
      <MDBCol>
        <MDBPagination className="mb-2">
          <MDBPageItem disabled={props.disabledPrev}>
            <MDBPageNav onClick={props.prevPage} aria-label="Previous">
              <span aria-hidden="true">Previous</span>
            </MDBPageNav>
          </MDBPageItem>
          {total &&
            total.map((total, i) => (
              <MDBPageItem
                key={i + 1}
                active={i + 1 === props.active ? true : false}
              >
                <MDBPageNav onClick={() => clickNumber(i + 1)}>
                  {total}
                </MDBPageNav>
              </MDBPageItem>
            ))}
          <MDBPageItem>
            <MDBPageNav
              disabled={props.disabledNext}
              onClick={props.nextPage}
              aria-label="Previous"
            >
              <span aria-hidden="true">Next</span>
            </MDBPageNav>
          </MDBPageItem>
        </MDBPagination>
      </MDBCol>
    </MDBRow>
  );
};

export default PaginationPage;
