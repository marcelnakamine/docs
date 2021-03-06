import React from 'react'
import debounce from 'lodash.debounce'
import { RequestHeader } from '~/components/text/code'
import CircledQuestion from '~/components/icons/circled-question'

class ScrollerContainer extends React.PureComponent {
  state = { hasMoreScroll: false }

  scrollerNode = null

  onScroll = () => {
    this.updateScrollState()
  }

  onWindowResize = debounce(() => {
    this.updateScrollState()
  }, 250)

  updateScrollState() {
    const hasMoreScroll =
      this.scrollerNode.scrollWidth -
        this.scrollerNode.clientWidth -
        this.scrollerNode.scrollLeft >
      10
    if (this.state.hasMoreScroll !== hasMoreScroll) {
      this.setState({ hasMoreScroll })
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize)
    this.updateScrollState()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize)
  }

  render() {
    const { hasMoreScroll } = this.state
    return (
      <main className={hasMoreScroll ? 'has-more-scroll' : null}>
        <div
          className="scroller"
          ref={ref => (this.scrollerNode = ref)}
          onScroll={this.onScroll}
        >
          {this.props.children}
        </div>
        <div className="gradient" />

        <style jsx>{`
          main {
            position: relative;
            margin-bottom: 24px;
          }
          .scroller {
            overflow-x: auto;
          }
          .gradient {
            background: linear-gradient(
              to right,
              rgba(255, 255, 255, 0),
              rgba(255, 255, 255, 1)
            );
            opacity: 0;
            pointer-events: none;
            position: absolute;
            transition: opacity ease-in 300ms;
            top: 0;
            right: 0;
            bottom: 0;
            width: 100px;
          }
          .has-more-scroll .gradient {
            opacity: 1;
          }
        `}</style>
      </main>
    )
  }
}

export function Table({ children, head }) {
  return (
    <ScrollerContainer>
      <table>
        {head && <thead>{head}</thead>}
        <tbody>{children}</tbody>
      </table>
    </ScrollerContainer>
  )
}

export function InputTable({ children }) {
  return (
    <Table
      head={
        <Row>
          <Cell isHead>Key</Cell>
          <TypeCell isHead>Type</TypeCell>
          <Cell isHead>Required</Cell>
          <FullWidthCell isHead>Description</FullWidthCell>
        </Row>
      }
    >
      {children}
    </Table>
  )
}

export function OutputTable({ children }) {
  return (
    <Table
      head={
        <Row>
          <Cell isHead>Key</Cell>
          <TypeCell isHead>Type</TypeCell>
          <FullWidthCell isHead>Description</FullWidthCell>
        </Row>
      }
    >
      {children}
    </Table>
  )
}

export function HeadersTable({ children }) {
  return (
    <Table
      head={
        <Row>
          <Cell isHead>Header</Cell>
          <Cell isHead>Description</Cell>
        </Row>
      }
    >
      {children}
    </Table>
  )
}

export function Row({ children }) {
  return <tr>{children}</tr>
}

export function Cell({ children, isHead, center }) {
  const className = center ? 'center' : null
  if (isHead) {
    return (
      <th className={className}>
        {children}
        <style jsx>{`
          th {
            padding: 12px 20px 12px 0;
            color: #999;
            font-size: var(--font-size-small);
            line-height: var(--line-height-small);
            font-weight: normal;
            text-align: left;
            text-transform: uppercase;
            vertical-align: top;
          }
          th:last-child {
            padding-right: 0;
          }
          .center {
            text-align: center;
          }
        `}</style>
      </th>
    )
  } else {
    return (
      <td className={className}>
        {children}
        <style jsx>{`
          td {
            border-bottom: 1px solid var(--accents-2);
            font-size: var(--font-size-small);
            line-height: var(--line-height-small);
            padding: 12px 20px 12px 0;
            vertical-align: top;
          }
          td:last-child {
            padding-right: 0;
          }

          :global(tr:last-child) td {
            border-bottom-color: transparent;
          }

          .center {
            text-align: center;
          }
        `}</style>
      </td>
    )
  }
}

export function TypeCell({ children, ...props }) {
  return (
    <Cell {...props}>
      <a className={props.isHead ? 'head' : null} href="#api-basics/types">
        <span>{children}</span>
        {props.isHead ? <CircledQuestion /> : null}
        <style jsx>
          {`
            a {
              text-decoration: none;
              color: #666;
              font-size: inherit;
            }
            a.head {
              align-items: center;
              color: inherit;
              display: flex;
            }
            a:hover,
            a.head:hover {
              color: #000;
              text-decoration: underline dashed;
            }
            a.head span {
              margin-right: 5px;
            }
            a.head:hover :global(svg circle) {
              stroke: #000;
            }
            a.head:hover :global(svg text) {
              fill: #000;
            }
          `}
        </style>
      </a>
    </Cell>
  )
}

export function BoldCell({ children, ...props }) {
  return (
    <Cell {...props}>
      <b>{children}</b>
    </Cell>
  )
}

export function HeaderCell({ children, ...props }) {
  return (
    <Cell {...props}>
      <RequestHeader>
        <b>{children}</b>
      </RequestHeader>
    </Cell>
  )
}

export function BooleanCell({ status = false, ...props }) {
  return <Cell {...props}>{status ? 'Yes' : 'No'}</Cell>
}

export function FullWidthCell(props) {
  const { children, ...rest } = props
  return (
    <Cell {...rest}>
      <div>{children}</div>
      <style jsx>{`
        @media screen and (max-width: 700px) {
          div {
            width: calc(100vw - 42px);
          }
        }
      `}</style>
    </Cell>
  )
}
